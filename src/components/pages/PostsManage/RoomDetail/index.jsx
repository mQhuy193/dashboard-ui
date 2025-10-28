import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './RoomDetail.css';

const RoomDetail = ({ room: roomProp }) => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        // Nếu đã có room từ props (tức là popup) thì không cần fetch nữa
        if (roomProp) {
            setRoom(roomProp);
            setLoading(false);
            return;
        }

        const fetchRoomDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    navigate('/login');
                    return;
                }

                const roomResponse = await fetch(`http://localhost:8080/api/rooms/getById/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!roomResponse.ok) throw new Error('Failed to fetch room details');
                const roomData = await roomResponse.json();

                const [addressRes, mediaRes, furnitureRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/addresses/getById/${roomData.addressId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:8080/api/room-media/getByRoomId/${roomId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:8080/api/room-furniture/getByRoomId/${roomId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const [addressData, mediaData, furnitureData] = await Promise.all([
                    addressRes.json(),
                    mediaRes.json(),
                    furnitureRes.json(),
                ]);

                setRoom({
                    ...roomData,
                    address: addressData,
                    media: mediaData,
                    furniture: furnitureData.utility,
                });
            } catch (error) {
                console.error('Error fetching room details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (roomId) fetchRoomDetail();
    }, [roomId, navigate, roomProp]);

    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };

    const nextImage = () => {
        if (room?.media && room.media.length > 0) {
            setCurrentImageIndex((prev) => (prev === room.media.length - 1 ? 0 : prev + 1));
        }
    };

    const prevImage = () => {
        if (room?.media && room.media.length > 0) {
            setCurrentImageIndex((prev) => (prev === 0 ? room.media.length - 1 : prev - 1));
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    const getFurnitureDisplayName = (furniture) => {
        const furnitureMap = {
            'Điều hòa': 'Điều hòa',
            'Tủ lạnh': 'Tủ lạnh',
            Bếp: 'Bếp',
            fridge: 'Tủ lạnh',
            kitchen: 'Bếp',
            air_conditioner: 'Điều hòa',
        };
        return furnitureMap[furniture] || furniture;
    };

    if (loading) {
        return (
            <div className="room-detail-container">
                <div className="loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Đang tải thông tin phòng...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="room-detail-container">
                <div className="error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>Không tìm thấy thông tin phòng</p>
                    {/* <button onClick={() => navigate(-1)} className="back-button">
                        Quay lại
                    </button> */}
                </div>
            </div>
        );
    }

    const imageList = room.media?.filter((m) => m.mediaUrl && /\.(png|jpg|jpeg|gif|webp)$/i.test(m.mediaUrl)) || [];

    return (
        <div className="room-detail-container">
            <div className="room-detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    Quay lại
                </button>
                <h1>Chi tiết phòng trọ</h1>
            </div>

            <div className="room-detail-content">
                {/* Phần hình ảnh */}
                <div className="room-images-section">
                    <h2>Hình ảnh phòng</h2>
                    {imageList.length > 0 ? (
                        <div className="images-grid">
                            <button className="carousel-nav prev" onClick={prevImage} disabled={imageList.length <= 1}>
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <div className="image-item" onClick={() => openImageModal(currentImageIndex)}>
                                <img
                                    src={imageList[currentImageIndex].mediaUrl}
                                    alt={`Hình ảnh ${currentImageIndex + 1}`}
                                    className="room-image"
                                />
                                <div className="image-overlay">
                                    <i className="fas fa-search-plus"></i>
                                </div>
                                {imageList.length > 1 && (
                                    <div className="image-counter">
                                        {currentImageIndex + 1} / {imageList.length}
                                    </div>
                                )}
                            </div>

                            <button className="carousel-nav next" onClick={nextImage} disabled={imageList.length <= 1}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    ) : (
                        <div className="no-images">
                            <i className="fas fa-image"></i>
                            <p>Chưa có hình ảnh nào</p>
                        </div>
                    )}
                </div>

                {/* Thông tin chi tiết */}
                <div className="room-info-section">
                    <div className="room-header">
                        <h2 className="room-title">{room.title}</h2>
                        <span className={`room-status ${room.isActive ? 'active' : 'inactive'}`}>
                            {room.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                        </span>
                    </div>

                    <div className="room-price">
                        <span className="price-label">Giá thuê:</span>
                        <span className="price-value">{formatPrice(room.price)}đ/tháng</span>
                    </div>

                    <div className="room-details-grid">
                        <div className="detail-item">
                            <i className="fas fa-expand detail-icon"></i>
                            <span className="detail-label">Diện tích:</span>
                            <span className="detail-value">{room.area}m²</span>
                        </div>
                        <div className="detail-item">
                            <i className="fas fa-user detail-icon"></i>
                            <span className="detail-label">Số người ở tối đa:</span>
                            <span className="detail-value">{room.maxOccupants} người</span>
                        </div>
                    </div>

                    <div className="room-address">
                        <i className="fas fa-map-marker-alt address-icon"></i>
                        <span className="address-text">
                            {room.address
                                ? `${room.address.streetAddress}, ${room.address.wardAddress}`
                                : 'Đang tải địa chỉ...'}
                        </span>
                    </div>

                    {room.furniture && room.furniture.length > 0 && (
                        <div className="room-furniture">
                            <h3>Nội thất có sẵn</h3>
                            <div className="furniture-list">
                                {room.furniture.map((item, index) => (
                                    <span key={index} className="furniture-item">
                                        <i className="fas fa-check furniture-icon"></i>
                                        {getFurnitureDisplayName(item)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {room.description && (
                        <div className="room-description">
                            <h3>Mô tả chi tiết</h3>
                            <p className="description-text">{room.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal hiển thị hình ảnh lớn */}
            {showImageModal && imageList.length > 0 && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeImageModal}>
                            <i className="fas fa-times"></i>
                        </button>
                        <button className="modal-nav prev" onClick={prevImage}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <img
                            src={imageList[currentImageIndex].mediaUrl}
                            alt={`Hình ảnh ${currentImageIndex + 1}`}
                            className="modal-image"
                        />
                        <button className="modal-nav next" onClick={nextImage}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        <div className="modal-counter">
                            {currentImageIndex + 1} / {imageList.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetail;
