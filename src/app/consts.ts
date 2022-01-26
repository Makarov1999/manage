import { ZoneData } from './zone-data';

export const DefaultZoneValues: ZoneData[] = [
  {
    postId: 76466,
    value: 420
  },
  {
    postId: 76462,
    value: 502
  },
  {
    postId: 76280,
    value: 489
  },
  {
    postId: 76270,
    value: 350
  },
  {
    postId: 76351,
    value: 390
  },
  {
    postId: 76943,
    value: 1210
  },
  {
    postId: 76284,
    value: 450
  }
];

// export const ZonesPosts: number[] = [76351, 76462, 76280, 76367, 76270, 76275, 76466, 76943, 76278, 76284];
export const ZonesPosts: number[] = [
  76962,
  76293,
  76289,
  76284,
  76280,
  76278,
  76295,
  76462,
  76466,
  76943,
  76367,
  76417,
  76380,
  76288,
  76351,
  76275,
  76270
];

export enum AuthAPIRoutes {
  Direct = 'auth.direct',
  Logout = 'auth.logout',
}

export enum StationsAPIRoutes {
  GetAll = 'posts.get?offset=0&count=100',
};

export enum MeasureAPIRoutes {
  Add = 'measurements.add',
  Get = 'measurements.get',
  AddExternal = 'externalData.addEntry',
  GetByPostIds = 'measurements.getByPostsIds',
}

export enum ForecastAPIRoutes {
  Init = 'forecast.init',
  GetLastForStation = 'forecast.getLastForPost',
  InitAll = 'forecast.queueAll',
  GetByStartDate = 'forecast.getByStartDate',
}

export enum TrainingAPIRoutes {
  Start = 'training.start',
  GetStatus = 'training.getStatus',
}

export enum ReportsAPIRoutes {
  LastForecasts = 'reports.createFromLastForecasts',
  Analysis = 'reports.createAnalysisForDays',
}