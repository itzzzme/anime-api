import * as handleRequestHelper from '../helper/handleRequest.helper.js';

export const getCategory = async (req, res, routeType) => {

    await handleRequestHelper.handleRequest(req, res, routeType);
};
