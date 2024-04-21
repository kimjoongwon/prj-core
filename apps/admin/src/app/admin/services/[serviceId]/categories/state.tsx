import { makeAutoObservable } from 'mobx';

class CategoryPage {
  openedCategorySections = [];

  constructor() {
    makeAutoObservable(this);
  }
}
