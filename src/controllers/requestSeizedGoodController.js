import * as requestService from "../services/requestService.js";

export const handlePostRequestItem = async (req, res, next) => {
  try {
    const request = await requestService.requestSeizedGoodItem(
      req.user,
      req.body
    );
    res.status(201).json({ message: "Request created successfully.", request });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllRequestItems = async (req, res, next) => {
  try {
    const requests = await requestService.getAllGoodsRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const handleGetRequest = async (req, res, next) => {
  try {
    const request = await requestService.getGoodRequestById(req.params.id);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const handleGetUserRequests = async (req, res, next) => {
  try {
    const requests = await requestService.getUserRequests(
      req.user.organizationId
    );
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateRequestItem = async (req, res, next) => {
  try {
    const updatedRequest = await requestService.updateRequestGood(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Request updated successfully.", updatedRequest });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteRequestItem = async (req, res, next) => {
  try {
    await requestService.deleteGoodRequestById(req.params.id);
    res
      .status(201)
      .json({ message: `Request with ID(${req.params.id}) has been removed.` });
  } catch (error) {
    next(error);
  }
};

export const handleApproveRequest = async (req, res, next) => {
  try {
    const approvedRequest = await requestService.approveRequest(req.params.id);
    res.status(200).json({
      message: "Request approved successfully.",
      request: approvedRequest,
    });
  } catch (error) {
    next(error);
  }
};
