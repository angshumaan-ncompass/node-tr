const { compress, compressGzip } = require("../../utilities/compression");
const {
  studentSchema,
  updateSchema,
  deleteSchema,
  readStudentSchema,
  loginSchema,
} = require("../models/validationSchema");

const createValidation = (req, res, next) => {
  studentDetails = req.body;
  const result = studentSchema.validate(studentDetails);
  if (result.error) {
    const response = {
      success: false,
      message: result.error.message,
      data: {},
    };
    compress(response);
    res.status(500).send(response);
    next(result.error);
  } else {
    next();
  }
};

const updateValidation = (req, res, next) => {
  const updateDetails = req.body;
  const result = updateSchema.validate(updateDetails);
  if (result.error) {
    const response = {
      success: false,
      message: result.error.message,
      data: {},
    };
    compress(response);
    res.status(500).send(response);
    next(result.error);
  } else {
    next();
  }
};

const deleteValidation = (req, res, next) => {
  const studentId = req.params;
  const result = deleteSchema.validate(studentId);
  if (result.error) {
    const response = {
      success: false,
      message: result.error.message,
      data: {},
    };
    compress(response);
    res.status(500).send(response);
    next(result.error);
  } else {
    next();
  }
};

const readOneValidation = (req, res, next) => {
  const studentDetail = req.params;
  const result = readStudentSchema.validate(studentDetail);
  if (result.error) {
    const response = {
      success: false,
      message: result.error.message,
      data: {},
    };
    compress(response);
    res.status(500).send(response);
    next(result.error);
  } else {
    next();
  }
};

const loginValidation = (req, res, next) => {
  const loginDetails = req.body;
  const result = loginSchema.validate(loginDetails);
  if (result.error) {
    const response = {
      success: false,
      message: result.error.message,
      data: {},
    };
    compress(response);
    res.status(500).send(response);
    next(result.error);
  } else {
    next();
  }
};

module.exports = {
  createValidation,
  updateValidation,
  deleteValidation,
  readOneValidation,
  loginValidation,
};