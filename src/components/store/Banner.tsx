import Image from 'next/image';
import Link from 'next/link';
import store1 from '../../asserts/store/store1.png';
import store2 from '../../asserts/store/store2.png';

const StoreBanner = () => {
  return (
    <>
      <div className="flex flex-col gap-3 justify-center items-center *:text-white bg-[#78B3CE] h-52 w-full">
        <div className="flex flex-row  justify-center items-center pl-3 ">
          <Image src={store2} alt="store2" width={200} className="sm:hidden xs:hidden" />
          <h1 className="text-4xl xs:text-xl sm:text-xl  ">
            공동 구매로 <br />
            알맞는 용품을 <br /> 찾아주세요!
          </h1>
          <Image src={store1} alt="store1" width={200} />
        </div>
        <div>
          {/* <Link href={'/home/store/group_purchase'} className="font-semibold hover:text-blue-500">
            공동구매 등록하기
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default StoreBanner;