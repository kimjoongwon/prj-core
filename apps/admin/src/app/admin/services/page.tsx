'use client';

import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/web';
import { observer } from 'mobx-react-lite';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useServicesPage } from './hooks';

// group
// category
// 관계..

// 비즈니스 파트너 -> 법인사업자, 개인사업자
// 법인사업자, 개인사업자 -> 하위 분류
// 사용자 존재

// 엔티티간의 관계는 1:1이 존재한다.
// 그 엔티티간의 관계를 다대다로 만들어야 한다.
// 그 중간 요소를 그룹으로 표현한다?
// 비즈니스파트너 -> 법인사업자 -> A사(Entity)
// 비즈니스파트너 -> 법인사업자 -> B사(Entity)
// 비즈니스파트너 -> 법인사업자 -> C사(Entity)
// 비즈니스파트너 -> 법인사업자 -> D사(Entity)
// 비즈니스파트너 -> 법인사업자 -> E사(Entity)

// 결국 그룹이란 엔티티들 묶는 단위이다. A와 B사를 묶어서 유료가입회사라는 그룹을 만들면 그들은 분류가 아니라 그룹이 된다.

// 대학생 -> 3학년 -> AUser(Entity) -> A사 멤버, B사 멤버, C사 멤버
// 대학생 -> 3학년 -> BUser(Entity) -> A사 멤버, C사 멤버
// 대학생 -> 2학년 -> CUser(Entity) -> A사 멤버, B사 멤버, C사 멤버, D사 멤버

// 대학생이 A와 B사 인턴으로 근무 했다면?

function ServicesPage() {
  const servicesPage = useServicesPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      servicesQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = servicesPage;

  return (
    <>
      <SearchFilterContainer>
        <Search state={state.search} queryState={state.query} path="email" />
      </SearchFilterContainer>
      <ButtonGroupContainer>
        <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data.services.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.services.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(ServicesPage);
