export const mutations = {
  newedit: 'createCategory',
  edit: 'updateCategory',
  add: 'createCategory',
};

export const formTypes = {
  편집: {
    name: '편집',
    value: 'edit',
    mutations,
  },
  추가: {
    name: '추가',
    value: 'add',
    mutations,
  },
};
