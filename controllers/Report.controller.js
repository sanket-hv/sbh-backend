const { Party, Sales, SalesDetail } = require("../models");
const {
  ErrorResponse,
  notFoundResponse,
  successResponse,
  successResponseWithData,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../helpers/apiResponses");

const getGSTReport = async (req, res) => {
  try {
    let { duration, party } = req.body;

    let query = {
      user: req.userId,
      salesDate: { $gte: duration.startDate, $lte: duration.endDate },
    };

    if (party) query.party = party;

    let report = await Sales.find(
      query,
      "_id salesNo salesDate cgstPer cgstAmt sgstPer sgstAmt igstPer igstAmt challanNo"
    ).populate({
      path: "party",
      select: { _id: 0, partyName: 1 },
    });

    report = await report.map((sale, index) => {
      sale._doc.srNo = index + 1;
      return sale;
    });

    return successResponseWithData(res, "GST Report", report);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getProductReport = async (req, res) => {
  try {
    let { party } = req.body;

    let query = {
      user: req.userId,
    };

    if (party) query.party = party;

    let sales = await Sales.find(query, "_id party", {
      sort: { product: -1, rate: -1 },
    }).populate({
      path: "party",
      select: { _id: 0, partyName: 1 },
    });

    let salesDetail = await SalesDetail.find(
      {
        sales: { $in: sales.map((sale) => sale._id) },
      },
      "_id product rate sales"
    );

    let data = [];

    for (let detail of salesDetail) {
      let { partyName } = await sales.filter(
        (sale) => sale._id.toString() == detail.sales.toString()
      )[0]?.party;

      let { _id, product, rate } = detail;

      let obj = { partyName, _id, product, rate };
      if (
        !data.filter(
          (data) =>
            data.product == obj.product && data.partyName == obj.partyName
        ).length
      )
        data.push(obj);

      /* if (!data.includes(obj)) {
        data.push(obj);
      } */
    }

    data = await data.map((d, i) => ({ ...d, srNo: i + 1 }));

    return successResponseWithData(res, "Product Report", data);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

const getPaymentReport = async (req, res) => {
  try {
    let { duration, party } = req.body;

    let query = {
      user: req.userId,
      salesDate: { $gte: duration.startDate, $lte: duration.endDate },
    };

    let partyQuery = { user: req.userId };

    if (party) {
      partyQuery._id = party;
    }

    let parties = await Party.find(partyQuery);

    query.party = { $in: parties.map((party) => party._id) };

    let sales = await Sales.find(query).populate("party");

    let data = [];

    for (let party of parties) {
      let { partyName, _id } = party;
      let partySales = await sales.filter(
        (sale) => sale.party._id.toString() == party._id.toString()
      );

      if (!partySales.length) continue;

      let invoiceNo = await partySales.map((d) => d.salesNo).join(", ");
      let challanNo = await partySales
        .map((d) => d.challanNo)
        .filter((d) => d)
        .join(", ");

      let totalAmt = await partySales
        .map((d) => d.roundAmt)
        .filter((d) => d)
        .reduce((prev, curr) => prev + curr, 0);

      data.push({ _id, partyName, invoiceNo, challanNo, totalAmt });
    }

    data = await data.map((d, i) => ({ ...d, srNo: i + 1 }));

    return successResponseWithData(res, "Payment Report", data);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, err.message);
  }
};

module.exports = { getGSTReport, getProductReport, getPaymentReport };
