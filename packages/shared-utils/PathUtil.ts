import { Path } from 'path-parser';
import * as R from 'remeda';

export class PathUtil {
  static getUrlWithParamsAndQueryString(
    url: string,
    params: object = {},
    queryString?: string,
  ) {
    const path = new Path(url);

    let pathWithParams = '';
    if (R.isEmpty(params)) {
      pathWithParams = url;
    } else {
      pathWithParams = path.build(params);
    }

    if (queryString) {
      pathWithParams = pathWithParams + '?' + queryString;
    }

    return pathWithParams;
  }

  static convertFromPathParamsToQueryParams({
    pathParamKeys,
    pathParams,
  }: {
    pathParamKeys: string[];
    pathParams: object;
  }) {
    return Object.fromEntries(pathParamKeys.map(key => [key, pathParams[key]]));
  }
}
