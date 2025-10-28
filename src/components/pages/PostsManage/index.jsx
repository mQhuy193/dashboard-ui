import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PostsManage.module.scss';
import classNames from 'classnames/bind';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlus,
    faPenToSquare,
    faEye,
    faCheck,
    faCloudUploadAlt,
    faSpinner,
    faEllipsisV,
    faMapMarkerAlt,
    faMoneyBillWave,
    faExpand,
    faUser,
    faSnowflake,
    faUtensils,
    faCouch,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import RoomDetail from './RoomDetail';
// import LogoutButton from '../LogOut';

const cx = classNames.bind(styles);

const PostsManage = () => {
    const navigate = useNavigate();
    const [showPostForm, setShowPostForm] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        area: '',
        maxOccupants: '',
        streetAddress: '',
    });
    const [files, setFiles] = useState([]);
    const [managerInfo, setManagerInfo] = useState({
        userName: '',
        email: '',
        phone: '',
        address: '',
        managerId: 0,
    });
    const [rooms, setRooms] = useState([]);
    const [isMediaPopupOpen, setIsMediaPopupOpen] = useState(false);
    const [popupImages, setPopupImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const processedRoomsRef = useRef(new Set());

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showRoomDetail, setShowRoomDetail] = useState(false);
    const handleViewDetail = (room) => {
        setSelectedRoom(room);
        setShowRoomDetail(true);
    };
    const handleCloseDetail = () => {
        setShowRoomDetail(false);
        setSelectedRoom(null);
    };

    // Function để refresh danh sách rooms
    const refreshRooms = useCallback(async () => {
        try {
            console.log('refreshRooms được gọi với managerId:', managerInfo.managerId);
            const token = localStorage.getItem('token');
            if (!token || !managerInfo.managerId) {
                console.error('Token or Manager ID not available');
                return;
            }

            const roomsResponse = await fetch(
                `http://localhost:8080/api/rooms/search/by-manager-id?id=${managerInfo.managerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!roomsResponse.ok) {
                throw new Error('Failed to fetch rooms');
            }

            const roomsData = await roomsResponse.json();

            const roomsWithDetails = await Promise.all(
                roomsData.map(async (room) => {
                    try {
                        const addressResponse = await fetch(
                            `http://localhost:8080/api/addresses/getById/${room.addressId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );
                        const addressData = await addressResponse.json();

                        const mediaResponse = await fetch(
                            `http://localhost:8080/api/room-media/getByRoomId/${room.roomId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );
                        const mediaData = await mediaResponse.json();

                        const furnitureResponse = await fetch(
                            `http://localhost:8080/api/room-furniture/getByRoomId/${room.roomId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );
                        const furnitureData = await furnitureResponse.json();

                        return {
                            ...room,
                            address: addressData,
                            media: mediaData,
                            furniture: furnitureData.utility,
                        };
                    } catch (error) {
                        console.error(`Error fetching details for room ${room.roomId}:`, error);
                        return room;
                    }
                }),
            );

            console.log('Đã fetch được', roomsWithDetails.length, 'rooms');
            setRooms(roomsWithDetails);
            console.log('Đã set rooms state');
        } catch (error) {
            console.error('Error refreshing rooms:', error);
        }
    }, [managerInfo.managerId]);

    const openMediaPopup = (mediaList) => {
        const imageUrls = (mediaList || [])
            .filter((m) => typeof m.mediaUrl === 'string' && /\.(png|jpg|jpeg|gif|webp)$/i.test(m.mediaUrl))
            .map((m) => m.mediaUrl);
        if (imageUrls.length === 0) return;
        setPopupImages(imageUrls);
        setIsMediaPopupOpen(true);
    };

    const closeMediaPopup = () => {
        setIsMediaPopupOpen(false);
        setPopupImages([]);
    };

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                const decoded = jwtDecode(token);
                const managerName = decoded.sub;

                const response = await fetch(
                    `http://localhost:8080/api/managers/getByName?managerName=${managerName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch manager info');
                }
                const data = await response.json();

                setManagerInfo({
                    userName: data.userName || 'Unknown',
                    email: data.email || 'No email provided',
                    phone: data.phone || 'No phone provided',
                    address: data.address || 'No address provided',
                    managerId: data.managerId || 0,
                });
            } catch (error) {
                console.error('Error fetching manager info:', error);
            }
        };

        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                if (!managerInfo.managerId) {
                    console.error('Manager ID not available');
                    return;
                }

                const roomsResponse = await fetch(
                    `http://localhost:8080/api/rooms/search/by-manager-id?id=${managerInfo.managerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!roomsResponse.ok) {
                    throw new Error('Failed to fetch rooms');
                }

                const roomsData = await roomsResponse.json();

                const roomsWithDetails = await Promise.all(
                    roomsData.map(async (room) => {
                        try {
                            const addressResponse = await fetch(
                                `http://localhost:8080/api/addresses/getById/${room.addressId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                            const addressData = await addressResponse.json();

                            const mediaResponse = await fetch(
                                `http://localhost:8080/api/room-media/getByRoomId/${room.roomId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                            const mediaData = await mediaResponse.json();

                            const furnitureResponse = await fetch(
                                `http://localhost:8080/api/room-furniture/getByRoomId/${room.roomId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                            const furnitureData = await furnitureResponse.json();

                            return {
                                ...room,
                                address: addressData,
                                media: mediaData,
                                furniture: furnitureData.utility,
                            };
                        } catch (error) {
                            console.error(`Error fetching details for room ${room.roomId}:`, error);
                            return room;
                        }
                    }),
                );

                setRooms(roomsWithDetails);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        const fetchProvinces = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }
                const response = await fetch('http://localhost:8080/api/provinces/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch provinces');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchManagerInfo();
        fetchProvinces();
    }, []);

    // useEffect riêng để fetch rooms khi có managerId
    useEffect(() => {
        if (managerInfo.managerId > 0) {
            refreshRooms();
        }
    }, [refreshRooms]);

    // useEffect để fetch thông tin địa chỉ cho bài viết mới
    useEffect(() => {
        const fetchAddressForNewRooms = async () => {
            const roomsNeedingAddress = rooms.filter(
                (room) => !room.address && room.addressId && !processedRoomsRef.current.has(room.roomId),
            );

            if (roomsNeedingAddress.length === 0) return;

            // Đánh dấu các room này đang được xử lý
            roomsNeedingAddress.forEach((room) => {
                processedRoomsRef.current.add(room.roomId);
            });

            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const updatedRooms = await Promise.all(
                    roomsNeedingAddress.map(async (room) => {
                        try {
                            const addressResponse = await fetch(
                                `http://localhost:8080/api/addresses/getById/${room.addressId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                            const addressData = await addressResponse.json();
                            return { ...room, address: addressData };
                        } catch (error) {
                            console.error(`Error fetching address for room ${room.roomId}:`, error);
                            return room;
                        }
                    }),
                );

                // Cập nhật rooms với thông tin địa chỉ mới
                setRooms((prevRooms) =>
                    prevRooms.map((room) => {
                        const updatedRoom = updatedRooms.find((ur) => ur.roomId === room.roomId);
                        return updatedRoom || room;
                    }),
                );
            } catch (error) {
                console.error('Error fetching addresses for new rooms:', error);
            }
        };

        fetchAddressForNewRooms();
    }, [rooms]);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token not found in localStorage');
                        return;
                    }
                    const response = await fetch(
                        `http://localhost:8080/api/districts/getByProvince/${selectedProvince}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
                    if (!response.ok) throw new Error('Failed to fetch districts');
                    const data = await response.json();
                    setDistricts(data);
                    setSelectedDistrict('');
                    setWards([]);
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token not found in localStorage');
                        return;
                    }
                    const response = await fetch(`http://localhost:8080/api/wards/getByDistrict/${selectedDistrict}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error('Failed to fetch wards');
                    const data = await response.json();
                    setWards(data);
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((item) => item !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const handlePostFormToggle = () => {
        setShowPostForm(!showPostForm);
        if (!showPostForm) {
            setFormData({
                title: '',
                description: '',
                price: '',
                area: '',
                maxOccupants: '',
                streetAddress: '',
            });
            setFiles([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedWard('');
            setAmenities([]);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const newlySelected = Array.from(e.target.files);
        // Cộng dồn các lần chọn và loại bỏ trùng theo name+size
        setFiles((prev) => {
            const uniqueKey = (f) => `${f.name}_${f.size}`;
            const map = new Map(prev.map((f) => [uniqueKey(f), f]));
            newlySelected.forEach((f) => map.set(uniqueKey(f), f));
            return Array.from(map.values());
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            if (!managerInfo.managerId) {
                console.error('Manager ID not available');
                return;
            }

            const roomData = {
                managerId: managerInfo.managerId,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                area: parseFloat(formData.area),
                maxOccupants: formData.maxOccupants ? parseInt(formData.maxOccupants) : 1,
                streetAddress: formData.streetAddress,
                wardId: parseInt(selectedWard),
            };

            const roomResponse = await fetch('http://localhost:8080/api/rooms/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(roomData),
            });

            if (!roomResponse.ok) throw new Error('Failed to create room');
            const roomResult = await roomResponse.json();
            const roomId = roomResult.roomId;

            if (files.length > 0) {
                const formDataUpload = new FormData();
                files.forEach((file) => formDataUpload.append('files', file));
                formDataUpload.append('roomId', roomId.toString());

                const mediaResponse = await fetch(`http://localhost:8080/api/room-media/create?roomId=${roomId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDataUpload,
                });

                if (!mediaResponse.ok) throw new Error('Failed to upload media');
            }

            if (amenities.length > 0) {
                const furnitureData = {
                    roomId: roomId,
                    furnitureName: amenities,
                };

                const furnitureResponse = await fetch('http://localhost:8080/api/room-furniture/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(furnitureData),
                });

                if (!furnitureResponse.ok) throw new Error('Failed to create furniture');
            }

            // Thêm bài viết mới vào danh sách ngay lập tức
            console.log('Đang thêm bài viết mới vào danh sách...');

            // Tạo object room mới với thông tin đầy đủ
            const newRoom = {
                roomId: roomId,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                area: parseFloat(formData.area),
                maxOccupants: formData.maxOccupants ? parseInt(formData.maxOccupants) : 1,
                isActive: true,
                managerId: managerInfo.managerId,
                addressId: roomResult.addressId || null,
                address: null, // Sẽ được fetch sau
                media:
                    files.length > 0
                        ? files.map((file, index) => ({
                              mediaId: `temp_${Date.now()}_${index}`,
                              mediaUrl: URL.createObjectURL(file),
                              roomId: roomId,
                          }))
                        : [],
                furniture: amenities,
            };

            // Thêm vào đầu danh sách rooms
            setRooms((prevRooms) => [newRoom, ...prevRooms]);
            console.log('Đã thêm bài viết mới vào danh sách!');

            setShowPostForm(false);
            setFormData({
                title: '',
                description: '',
                price: '',
                area: '',
                maxOccupants: '',
                streetAddress: '',
            });
            setFiles([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedWard('');
            setAmenities([]);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cx('PostsManage-container')}>
            <main className={cx('maincontent')}>
                <div className={cx('main-right')}>
                    <div className={cx('head-right')}>
                        <h1>Trang Cá Nhân</h1>
                        <button onClick={handlePostFormToggle} className={cx('post-new-button')}>
                            <FontAwesomeIcon icon={faCirclePlus} className={cx('button-icon')} />
                            Tạo Bài Viết Mới
                        </button>
                    </div>

                    {showPostForm && (
                        <div className={cx('post-modal')} onClick={handlePostFormToggle}>
                            <div className={cx('post-form-container')} onClick={(e) => e.stopPropagation()}>
                                <h3 className={cx('form-title')}>Tạo Bài Viết Mới</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor="title">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            className={cx('form-input')}
                                            placeholder="Nhập tiêu đề bài đăng"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Hình ảnh</label>
                                        <div className={cx('image-upload')}>
                                            <FontAwesomeIcon icon={faCloudUploadAlt} className={cx('upload-icon')} />
                                            <p className={cx('upload-text')}>Kéo thả ảnh vào đây hoặc</p>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className={cx('upload-button')}
                                                style={{ display: 'none' }}
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className={cx('upload-button')}>
                                                Chọn ảnh từ máy tính
                                            </label>
                                        </div>
                                    </div>

                                    <div className={cx('form-grid')}>
                                        <div>
                                            <label className={cx('form-label')} htmlFor="province">
                                                Tỉnh/Thành phố
                                            </label>
                                            <select
                                                id="province"
                                                className={cx('form-select')}
                                                value={selectedProvince} // This is a controlled component, className is not needed for the select itself, but for consistency I'll add it. Let's assume form-select is a global or a utility class. If it's component-specific, it should be cx('form-select'). I'll use cx.
                                                onChange={(e) => setSelectedProvince(e.target.value)}
                                            >
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {provinces.map((province) => (
                                                    <option key={province.provinceId} value={province.provinceId}>
                                                        {province.provinceName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={cx('form-label')} htmlFor="district">
                                                Quận/Huyện
                                            </label>
                                            <select
                                                id="district"
                                                className={cx('form-select')}
                                                value={selectedDistrict}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                disabled={!selectedProvince}
                                            >
                                                <option value="">Chọn Quận/Huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.districtId} value={district.districtId}>
                                                        {district.districtName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={cx('form-label')} htmlFor="ward">
                                                Phường/Xã
                                            </label>
                                            <select
                                                id="ward"
                                                className={cx('form-select')}
                                                value={selectedWard}
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                                disabled={!selectedDistrict}
                                            >
                                                <option value="">Chọn Phường/Xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.wardId} value={ward.wardId}>
                                                        {ward.wardName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor="streetAddress">
                                            Địa chỉ đường
                                        </label>
                                        <input
                                            type="text"
                                            id="streetAddress"
                                            className={cx('form-input')}
                                            placeholder="VD: 569 đường Đông La"
                                            value={formData.streetAddress}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className={cx('form-grid')}>
                                        <div>
                                            <label className={cx('form-label')} htmlFor="price">
                                                Giá phòng (VNĐ/tháng)
                                            </label>
                                            <input
                                                type="text"
                                                id="price"
                                                className={cx('form-input')}
                                                placeholder="VD: 1200000"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className={cx('form-label')} htmlFor="area">
                                                Diện tích (m²)
                                            </label>
                                            <input
                                                type="text"
                                                id="area"
                                                className={cx('form-input')}
                                                placeholder="VD: 30.5"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className={cx('form-label')} htmlFor="maxOccupants">
                                                Số người ở tối đa
                                            </label>
                                            <input
                                                type="number"
                                                id="maxOccupants"
                                                className={cx('form-input')}
                                                placeholder="VD: 3"
                                                value={formData.maxOccupants}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')}>Nội thất</label>
                                        <div className={cx('amenities-grid')}>
                                            {['Điều hòa', 'Tủ lạnh', 'Bếp'].map((item) => (
                                                <div key={item} className={cx('amenity-item')}>
                                                    <input
                                                        type="checkbox"
                                                        id={item}
                                                        checked={amenities.includes(item)}
                                                        onChange={() => toggleAmenity(item)}
                                                        className={cx('amenity-checkbox')}
                                                    />
                                                    <label htmlFor={item} className={cx('amenity-label')}>
                                                        {item}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label className={cx('form-label')} htmlFor="description">
                                            Mô tả thêm
                                        </label>
                                        <textarea
                                            id="description"
                                            className={cx('form-textarea')}
                                            placeholder="Nhập mô tả chi tiết về phòng trọ..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className={cx('form-actions')}>
                                        <button
                                            type="button"
                                            onClick={handlePostFormToggle}
                                            className={cx('cancel-button')}
                                        >
                                            Hủy
                                        </button>
                                        <button type="submit" className={cx('submit-button')} disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                    Đang đăng...
                                                </>
                                            ) : (
                                                'Đăng bài'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={cx('post-grid')}>
                        {rooms.map((room) => (
                            <div key={room.roomId} className={cx('post-item')}>
                                <div className={cx('post-image-container')}>
                                    <img
                                        src={
                                            room.media?.find(
                                                (m) =>
                                                    m.mediaUrl.endsWith('.png') ||
                                                    m.mediaUrl.endsWith('.jpg') ||
                                                    m.mediaUrl.startsWith('blob:'),
                                            )?.mediaUrl || 'https://via.placeholder.com/400x250'
                                        }
                                        alt={room.title}
                                        className={cx('post-image')}
                                    />
                                    <span
                                        className={cx('post-status', {
                                            active: room.isActive,
                                            inactive: !room.isActive,
                                        })}
                                    >
                                        {room.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                                    </span>
                                </div>

                                <div className={cx('post-content')}>
                                    <div className={cx('post-header')}>
                                        <h3 className={cx('post-title')}>{room.title}</h3>
                                        <div className={cx('post-menu')}>
                                            <button
                                                className={cx('menu-button')}
                                                aria-label="Mở menu tùy chọn"
                                                title="Mở menu tùy chọn"
                                            >
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </button>
                                            <div className={cx('menu-dropdown')}>
                                                <button className={cx('menu-item')}>
                                                    <FontAwesomeIcon icon={faPenToSquare} className={cx('menu-icon')} />
                                                    Chỉnh sửa
                                                </button>
                                                <button className={cx('menu-item')}>
                                                    {room.isActive ? (
                                                        <FontAwesomeIcon icon={faEye} className={cx('menu-icon')} />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faCheck} className={cx('menu-icon')} />
                                                    )}

                                                    {room.isActive ? 'Ẩn bài đăng' : 'Hiện bài đăng'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <p className={cx('post-address')}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('address-icon')} />
                                        {room.address
                                            ? `${room.address.streetAddress}, ${room.address.wardAddress}`
                                            : room.streetAddress || 'Đang tải địa chỉ...'}
                                    </p>

                                    <div className={cx('post-details')}>
                                        <div className={cx('detail-item')}>
                                            <FontAwesomeIcon icon={faMoneyBillWave} className={cx('detail-icon')} />
                                            <span className={cx('detail-value')}>
                                                {room.price.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <FontAwesomeIcon icon={faExpand} className={cx('detail-icon')} />
                                            <span className={cx('detail-value')}>{room.area}m²</span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <FontAwesomeIcon icon={faUser} className={cx('detail-icon')} />
                                            <span className={cx('detail-value')}>{room.maxOccupants} người</span>
                                        </div>
                                    </div>

                                    <div className={cx('post-amenities')}>
                                        {room.furniture?.map((item) => {
                                            const amenityMap = {
                                                'Điều hòa': { icon: faCouch, name: 'Điều hòa' }, // Giả sử 'couch' là điều hòa
                                                'Tủ lạnh': { icon: faSnowflake, name: 'Tủ lạnh' },
                                                Bếp: { icon: faUtensils, name: 'Bếp' },
                                            };
                                            const amenity = amenityMap[item];
                                            if (!amenity) return null;
                                            return (
                                                <span key={item} className={cx('amenity-tag')}>
                                                    <FontAwesomeIcon
                                                        icon={amenity.icon}
                                                        className={cx('amenity-icon')}
                                                    />
                                                    {amenity.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <button onClick={() => handleViewDetail(room)} className={cx('view-detail-button')}>
                                        Xem Chi Tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={cx('pagination')}>
                        <nav className={cx('pagination-nav')}>
                            <button className={cx('pagination-button')} aria-label="Trang trước" title="Trang trước">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <button className={cx('pagination-button', 'active')}>1</button>
                            <button className={cx('pagination-button')}>2</button>
                            <button className={cx('pagination-button')}>3</button>
                            <button className={cx('pagination-button')} aria-label="Trang sau" title="Trang sau">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </nav>
                    </div>
                </div>
                {showRoomDetail && selectedRoom && (
                    <div className={cx('popup-overlay')} onClick={handleCloseDetail}>
                        <div className={cx('popup-content')} onClick={(e) => e.stopPropagation()}>
                            <button className={cx('close-button')} onClick={handleCloseDetail}>
                                ✕
                            </button>
                            <RoomDetail room={selectedRoom} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PostsManage;
