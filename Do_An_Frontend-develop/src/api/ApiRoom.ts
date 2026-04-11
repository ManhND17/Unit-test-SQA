import { IRoom, IBuilding } from '@src/types';
import { fetcher, IMetadata, QueryParam } from './Fetcher';

const path = {
  list: '/rooms',
  availableRooms: '/rooms/available-rooms',
  getById: (id: string | number) => `/rooms/${id}`,
  byBuilding: `/rooms/buildings`,
  create: '/rooms/create',
  update: (id: string | number) => `/rooms/update/${id}`,
  delete: (id: string | number) => `/rooms/delete/${id}`,
};

export interface RoomQueryParams extends QueryParam {
  sortBy?: 'code' | 'name' | 'capacity' | 'building' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string | undefined;
  buildingId?: string | number;
}

const getRooms = (params?: RoomQueryParams) => {
  return fetcher<{ data: IRoom[]; metadata: IMetadata }>({
    url: path.list,
    method: 'GET',
    params,
  });
};
const getAvailableRooms = () => {
  return fetcher<{ data: IRoom[] }>({
    url: path.availableRooms,
    method: 'GET',
  });
};
const getRoomById = (id: string | number) => {
  return fetcher<IRoom>({
    url: path.getById(id),
    method: 'GET',
  });
};
const getRoomsByBuilding = () => {
  return fetcher<{ data: IBuilding[] }>({
    url: path.byBuilding,
    method: 'GET',
  });
};

const createRoom = (data: Partial<IRoom>) => {
  return fetcher<IRoom>({
    url: path.create,
    method: 'POST',
    data,
  });
};

const updateRoom = (id: string | number, data: Partial<IRoom>) => {
  return fetcher<IRoom>({
    url: path.update(id),
    method: 'PUT',
    data,
  });
};
const deleteRoom = (id: string | number) => {
  return fetcher<void>({
    url: path.delete(id),
    method: 'DELETE',
  });
};

export default {
  getRooms,
  getRoomById,
  getAvailableRooms,
  getRoomsByBuilding,
  createRoom,
  updateRoom,
  deleteRoom,
};
