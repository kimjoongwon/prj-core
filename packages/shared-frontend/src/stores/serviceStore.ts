import { makeAutoObservable } from 'mobx';
import { ServiceEntity } from '../model';

class ServiceStore {
  services: ServiceEntity[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setServices(services: ServiceEntity[]) {
    this.services = services;
  }

  getServices(serviceName: ServiceEntity['name']) {
    return this.services.find(service => service.name === serviceName);
  }

  addService(service: ServiceEntity) {
    this.services.push(service);
  }

  removeService(service: ServiceEntity) {
    this.services = this.services.filter(s => s !== service);
  }
}

export const serviceStore = new ServiceStore();
