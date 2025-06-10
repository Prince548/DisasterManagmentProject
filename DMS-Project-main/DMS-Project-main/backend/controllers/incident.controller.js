import prisma from "../lib/prisma.js";
import {
  catchAsync,
  NotFoundError,
  AuthorizationError,
} from "../validators/customErrors.js";

export const getIncidents = catchAsync(async (req, res) => {
  const incidents = await prisma.incident.findMany({
    include: {
      user: {
        select: {
          fname: true,
          lname: true,
        },
      },
    },
  });
  res.status(200).json(incidents);
});

export const getIncident = catchAsync(async (req, res) => {
  const id = req.params.id;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
    include: {
      incidentDetail: true,
      user: {
        select: {
          fname: true,
          lname: true,
          avatar: true,
        },
      },
    },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  res.status(200).json(incident);
});

export const addIncident = catchAsync(async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  const newIncident = await prisma.incident.create({
    data: {
      ...body.incidentData,
      userId: tokenUserId,
      incidentDetail: {
        create: body.incidentDetail,
      },
    },
  });

  res.status(200).json(newIncident);
});

export const updateIncident = catchAsync(async (req, res) => {
  res.status(200).json({ message: " " });
});

export const deleteIncident = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  if (incident.userId !== tokenUserId) {
    throw new AuthorizationError(
      "You are not authorized to delete this incident"
    );
  }

  await prisma.incident.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "Incident deleted successfully" });
});

export const updateIncidentMailSent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  const updatedIncident = await prisma.incident.update({
    where: { id: id },
    data: { sentEmail: true },
  });

  res.status(200).json(updatedIncident);
});

export const approveIncident = catchAsync(async (req, res) => {
  const id = req.params.id;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  const updatedIncident = await prisma.incident.update({
    where: { id: id },
    data: { isApproved: "approved" },
  });

  res.status(200).json(updatedIncident);
});

export const rejectIncident = catchAsync(async (req, res) => {
  const id = req.params.id;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  const rejectIncident = await prisma.incident.update({
    where: { id: id },
    data: { isApproved: "rejected" },
  });

  res.status(200).json(rejectIncident);
});

export const deleteIncidentByAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;

  const incident = await prisma.incident.findUnique({
    where: { id: id },
  });

  if (!incident) {
    throw new NotFoundError("Incident", id);
  }

  await prisma.incident.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "Incident deleted successfully" });
});
