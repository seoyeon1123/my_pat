import React, { useEffect, useState } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import Modal from './Modal';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const KEYWORD_LIST = [
  { id: 1, value: '애견카페', emoji: '☕️' },
  { id: 2, value: '동물병원', emoji: '🧑‍⚕️' },
  { id: 3, value: '애견호텔', emoji: '🏨' },
];

export interface Place {
  id: string;
  name: string;
  address: string;
  x: string;
  y: string;
  phone: string | undefined;
  place_url?: string;
  category_name?: string;
}

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
  phone: string | undefined;
  place_url?: string;
  category_name?: string; // 카테고리 추가
}

interface MarkerPosition {
  lat: number;
  lng: number;
  name: string;
  address: string;
  phone?: string;
}

const Kakao = () => {
  const [search, setSearch] = useState<Place[]>([]);
  const [kakao, setKakao] = useState<typeof window.kakao | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
    errMsg: null,
    isLoading: true,
  });
  const [selectedMarker, setSelectedMarker] = useState<MarkerPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<MarkerPosition | null>(null);
  const [isCurrentLocationVisible, setIsCurrentLocationVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=acf4479a39c6800a7a112e1e85028978&libraries=services&autoload=false';
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      if (window.kakao && window.kakao.maps) {
        setKakao(window.kakao);
        setIsKakaoLoaded(true);
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          setIsCurrentLocationVisible(true);
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: null,
            isLoading: false,
          }));
          setIsCurrentLocationVisible(false);
        },
      );
    }
  }, []);

  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('acf4479a39c6800a7a112e1e85028978');
        console.log('Kakao SDK Initialized:', window.Kakao.isInitialized());
      }
    } else {
      console.error('Kakao SDK not loaded');
    }
  }, []);

  const handleKeywordSearch = (keyword: string, center: { lat: number; lng: number }) => {
    console.log('버튼 클릭됨:', keyword);
    if (!isKakaoLoaded || !kakao || !kakao.maps || !kakao.maps.services) {
      return;
    }

    const ps = new kakao.maps.services.Places();
    const options = {
      location: new kakao.maps.LatLng(center.lat, center.lng),
      radius: 4000,
    };

    ps.keywordSearch(
      keyword,
      (data: KakaoPlace[], status: string) => {
        if (status === kakao.maps.services.Status.OK) {
          const places = data.map((place) => {
            console.log('Place URL:', place.place_url);
            return {
              id: place.id,
              name: place.place_name,
              address: place.address_name,
              x: place.x,
              y: place.y,
              phone: place.phone,
              place_url: place.place_url,
              category_name: place.category_name || '카테고리 없음',
            } as Place;
          });
          setSearch(places);
        }
      },
      options,
    );
  };

  const handleMarkerClick = (marker: MarkerPosition) => {
    setSelectedMarker(marker);
    setOpenMarkerId(marker.name); // 마커 클릭 시 ID 저장
    setIsModalOpen(true); // 모달 열기
  };

  const moveLatLng = (place: Place) => {
    const newCenter = {
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    };

    const newMarker = {
      lat: newCenter.lat,
      lng: newCenter.lng,
      name: place.name,
      address: place.address,
      phone: place.phone,
    };

    setSelectedMarker(newMarker);

    setSelectedLocation({
      lat: newCenter.lat,
      lng: newCenter.lng,
      name: place.name,
      address: place.address,
      phone: place.phone,
    });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center items-start gap-6">
        <div className="flex flex-col gap-2 justify-center items-center relative">
          <Map
            center={selectedLocation || state.center}
            className="w-[1000px] h-[600px] rounded-lg shadow-md"
            level={3}>
            {isCurrentLocationVisible && (
              <MapMarker
                position={state.center}
                image={{
                  src: 'https://velog.velcdn.com/images/leeeee/post/4f0de3cf-1cfe-4db2-9afc-c900e030516d/image.png',
                  size: { width: 50, height: 50 },
                }}
              />
            )}

            {search.map((data) => {
              const markerPosition = {
                name: data.name,
                lat: parseFloat(data.y),
                lng: parseFloat(data.x),
                address: data.address,
              };

              return (
                <MapMarker
                  key={data.id}
                  position={markerPosition}
                  image={{
                    src: 'https://cdn-icons-png.flaticon.com/128/2098/2098567.png',
                    size: { width: 35, height: 35 },
                  }}
                  onClick={() => handleMarkerClick(markerPosition)}
                />
              );
            })}

            {selectedMarker && (
              <CustomOverlayMap position={selectedMarker} yAnchor={1}>
                <div className="absolute -top-24 -left-20 bg-white p-2 rounded shadow-lg text-center z-10">
                  <p className="font-bold">{selectedMarker.name}</p>
                  <p className="text-xs text-gray-600">{selectedMarker.address}</p>
                </div>
              </CustomOverlayMap>
            )}
          </Map>

          <div
            className="absolute top-1/2 -left-3 z-50 transform -translate-y-1/2 p-2 rounded-full cursor-pointer"
            onClick={toggleModal}>
            {isModalOpen ? (
              <ChevronLeftIcon className="size-7 font-bold text-red-600" />
            ) : (
              <ChevronRightIcon className="size-7 font-bold text-red-600" />
            )}{' '}
          </div>

          {isModalOpen && (
            <div className="absolute top-0 left-0  shadow-md z-20 transition-transform transform translate-x-0">
              <Modal
                search={search}
                openMarkerId={openMarkerId}
                setOpenMarkerId={setOpenMarkerId}
                moveLatLng={moveLatLng}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                currentLocation={state.center}
              />
            </div>
          )}

          <div className="flex flex-row gap-2 mt-4">
            {KEYWORD_LIST.map((keywordObj) => (
              <button
                key={keywordObj.id}
                type="button"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-400"
                onClick={() => handleKeywordSearch(keywordObj.value, state.center)}>
                {keywordObj.value + keywordObj.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kakao;
