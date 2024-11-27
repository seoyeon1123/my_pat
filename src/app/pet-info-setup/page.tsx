'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DogInfo from '@/components/petInfo/DogInfo';
import CatInfo from '@/components/petInfo/CatInfo';
import PetTypeRadio from '@/components/petInfo/PetTypeRadio';
import { useRecoilState, useRecoilValue } from 'recoil';
import { petAtom } from '@/state/petState';
import PetInfoActions from './actions';
import { userState } from '@/state/userState';
import { useSession } from 'next-auth/react';

const PetInfoSetup = () => {
  const petState = useRecoilValue(petAtom);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name!,
        email: session.user.email!,
        phone: '',
        username: '',
        password: '',
      });
    }
  }, [session, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!petState.petName || !petState.petAge || !petState.petType) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    try {
      console.log('PetInfoActions 호출 준비:', petState);
      // user.name을 PetInfoActions로 전달
      if (user) {
        await PetInfoActions({ ...petState }, user.name);
        alert('반려동물 정보가 설정되었습니다.');
        router.push('/home');
      }
    } catch (error) {
      console.error('PetInfoActions 호출 중 에러:', error);
      setError('정보 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-lightPinkbg p-5">
      <form
        className="flex flex-col gap-6 lg:w-1/3 xl:w-1/3 p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center text-darkPink py-4 font-hakgyo">
          댕냥살롱
        </h1>
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-xl font-bold">
            {user?.name}님 우리 댕냥이에 대해서 알려주세요!
          </h2>
          <p className="text-gray-600">
            만약, 예비견주라면 여기를 클릭해주세요 :)
          </p>
        </div>
        <PetTypeRadio />

        {petState.petType === '댕이' ? <DogInfo /> : <CatInfo />}

        <div className="flex justify-between gap-4">
          <button
            className="w-1/3 flex items-center justify-center bg-lightPink rounded-l-xl py-2"
            type="button"
            onClick={() => router.back()}
          >
            이전
          </button>
          <button
            className="w-2/3 flex items-center justify-center bg-darkPink text-white rounded-r-xl py-2"
            type="submit"
          >
            완료
          </button>
        </div>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default PetInfoSetup;
