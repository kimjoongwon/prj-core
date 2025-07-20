import { createFileRoute } from "@tanstack/react-router";

const GroundDetailInfoRouteComponent = () => {
  const { groundId } = Route.useParams();

  // Mock ground info data - in real app this would come from API
  const groundInfo = {
    name: "서울 그라운드",
    location: "서울시 강남구 테헤란로 123",
    capacity: "50명",
    description: "최신 시설을 갖춘 프리미엄 그라운드입니다.",
    facilities: ["주차장", "샤워실", "라커룸", "카페테리아"],
    openingHours: "09:00 - 22:00",
    phone: "02-1234-5678"
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">그라운드 정보</h4>
      
      <div className="bg-white shadow rounded-lg p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">이름</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.name}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">위치</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.location}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">수용인원</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.capacity}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">운영시간</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.openingHours}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">연락처</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.phone}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">편의시설</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.facilities.join(", ")}</dd>
          </div>
          
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">설명</dt>
            <dd className="mt-1 text-sm text-gray-900">{groundInfo.description}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service/grounds/$groundId/detail/info")({
  component: GroundDetailInfoRouteComponent,
});