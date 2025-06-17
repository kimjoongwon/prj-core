import { HeaderBuilderProps } from '@shared/types';

// SVG 폴더 아이콘 컴포넌트들 (ExpandableCell과 동일)
const FolderOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5H21V18a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18v-7.5h9.75z"
      clipRule="evenodd"
    />
  </svg>
);

const FolderClosedIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15z" />
  </svg>
);

export const HeaderBuilder = (props: HeaderBuilderProps) => {
  const { table, name = '-', expandable = false } = props;

  return (
    <div className="flex items-center">
      {expandable && (
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
          className="mr-2 flex items-center justify-center w-7 h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-all duration-200 border border-amber-200 hover:border-amber-300"
        >
          {table.getIsAllRowsExpanded() ? (
            <FolderOpenIcon className="w-5 h-5" />
          ) : (
            <FolderClosedIcon className="w-5 h-5" />
          )}
        </button>
      )}
      <span>{name}</span>
    </div>
  );
};
