import { Album, Weighted } from '../../../types';

export default interface IndexRouteData {
  topList: Weighted<Album>[];
}
