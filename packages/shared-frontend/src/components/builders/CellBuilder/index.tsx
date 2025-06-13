import { v4 } from 'uuid';
import { CellBuilderProps } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import dayjs from 'dayjs';
import { Button, Tooltip } from '@heroui/react';
import { Plate } from '../../../providers';

// 수정 아이콘 컴포넌트
const EditIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// 삭제 아이콘 컴포넌트
const DeleteIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// 생성 아이콘 컴포넌트
const CreateIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// 상세보기 아이콘 컴포넌트
const DetailIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6" />
    <path d="m21 12-6 0m-6 0-6 0" />
  </svg>
);

export const CellBuilder = ({
  row,
  getValue,
  buttons,
  type,
  expandable = false,
}: CellBuilderProps) => {
  if (type === 'date') {
    return <div>{dayjs(getValue() as string).format('YYYY.MM.DD')}</div>;
  }

  if (type === 'dateTime') {
    return <div>{dayjs(getValue() as string).format('YYYY.MM.DD HH:mm')}</div>;
  }

  if (type === 'time') {
    return <div>{dayjs(getValue() as string).format('HH:mm')}</div>;
  }

  if (buttons) {
    return (
      <div className="flex space-x-2">
        {buttons.map(button => {
          return (
            <div key={v4()} className="flex space-x-1">
              {/* 생성 버튼 */}
              <Tooltip content="생성" placement="top">
                <Button
                  {...button}
                  buttonType="cell"
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="min-w-unit-8 w-8 h-8 text-green-600 hover:bg-green-50"
                  onPress={() => {
                    Plate.navigation
                      .getNavigator()
                      .pushByName('그라운드 편집', {
                        id: row.original.id,
                        type: 'create',
                      });
                  }}
                >
                  <CreateIcon size={14} />
                </Button>
              </Tooltip>

              {/* 상세 버튼 */}
              <Tooltip content="상세보기" placement="top">
                <Button
                  {...button}
                  buttonType="cell"
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="min-w-unit-8 w-8 h-8 text-gray-600 hover:bg-gray-50"
                  onPress={() => {
                    Plate.navigation
                      .getNavigator()
                      .pushByName('그라운드 상세', {
                        id: row.original.id,
                      });
                  }}
                >
                  <DetailIcon size={14} />
                </Button>
              </Tooltip>

              {/* 수정 버튼 */}
              <Tooltip content="수정" placement="top">
                <Button
                  {...button}
                  buttonType="cell"
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="min-w-unit-8 w-8 h-8 text-blue-600 hover:bg-blue-50"
                  onPress={() => {
                    Plate.navigation
                      .getNavigator()
                      .pushByName('그라운드 편집', {
                        id: row.original.id,
                        type: 'edit',
                      });
                  }}
                >
                  <EditIcon size={14} />
                </Button>
              </Tooltip>

              {/* 삭제 버튼 */}
              <Tooltip content="삭제" placement="top">
                <Button
                  {...button}
                  buttonType="cell"
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="min-w-unit-8 w-8 h-8 text-red-600 hover:bg-red-50"
                  onPress={() => {
                    // 삭제 확인 후 처리하는 로직 필요
                    if (confirm('정말로 삭제하시겠습니까?')) {
                      // 삭제 API 호출 또는 삭제 처리 로직
                      console.log('삭제:', row.original.id);
                    }
                  }}
                >
                  <DeleteIcon size={14} />
                </Button>
              </Tooltip>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: expandable ? `${row.depth * 2}rem` : undefined,
      }}
    >
      <div className="flex">
        {expandable && row.getCanExpand() ? (
          <div
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '📂' : '📁'}
          </div>
        ) : null}
        {getValue<string>()}
      </div>
    </div>
  );
};
