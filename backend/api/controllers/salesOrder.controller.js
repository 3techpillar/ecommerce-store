import SalesOrder from "../models/salesOrder.model.js";

export const getAllSalesOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const salesOrders = await SalesOrder.find({ storeId }).populate([
      {
        path: "product",
        populate: {
          path: "price",
        },
      },
    ]);

    if (!salesOrders || salesOrders.length === 0) {
      return next(errorHandler(404, "Orders not found"));
    }

    return res
      .status(201)
      .json({ message: "Orders fetched successfully", salesOrders });
  } catch (error) {
    console.log("GET_ALL_SALES_ORDERS");
    next(error);
  }
};

export const getSalesOrderById = async (req, res, next) => {
  try {
    const { salesOrderId } = req.params;

    const salesOrder = await SalesOrder.findById(salesOrderId).populate([
      {
        path: "product",
        populate: {
          path: "price",
        },
      },
    ]);

    if (!salesOrder) {
      return next(errorHandler(404, "Sales order not found"));
    }

    return res
      .status(200)
      .json({ message: "Sales orders fetched successfully", salesOrder });
  } catch (error) {
    console.log("GET_SALES_ORDER_BY_ID");
    next(error);
  }
};
