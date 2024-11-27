import prisma from "../../prisma/client.js";
import { broadcastToClients } from "../events/serverSentEvents.js";
import { createSeizedGoodService } from "../services/CreateSeizedGoodService.js";
import { getAllSeizedGoodsService } from "../services/GetAllSeizedGoodsService.js";
import { getSeizedGoodByIdService } from "../services/GetSeizedGoodByIdService.js";
import { updateSeizedGoodService } from "../services/UpdateSeizedGoodService.js";
import { deleteSeizedGoodService } from "../services/DeleteSeizedGoodService.js";

export const createSeizedGood = async (req, res, next) => {
  const { name, description, value, categoryId } = req.body;

  try {
    if (!name || !description || !value || !categoryId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name must be at least 3 characters long" });
    }

    if (description.length < 10) {
      return res
        .status(400)
        .json({ error: "Description must be at least 10 characters long" });
    }

    const { seizedGood, category } = await createSeizedGoodService(
      { name, description, value, categoryId },
      req.files
    );

    // Create notification payload
    const notification = {
      type: "new",
      id: seizedGood.id,
      name: seizedGood.name,
      value: seizedGood.value,
      description: seizedGood.description,
      category: category.name,
    };

    // Notify NGOs clients for the corresponding category by id
    broadcastToClients(notification, parseInt(categoryId));

    res.status(201).json(seizedGood);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    next(error);
  }
};

export const getAllSeizedGoods = async (req, res, next) => {
  try {
    const seizedGoods = await getAllSeizedGoodsService();
    res.status(200).json(seizedGoods);
  } catch (error) {
    next(error);
  }
};

export const getSeizedGoodById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const seizedGood = await getSeizedGoodByIdService(id);
    res.status(200).json(seizedGood);
  } catch (error) {
    next(error);
  }
};

export const updateSeizedGood = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, value, categoryId } = req.body;

  try {
    const updatedSeizedGood = await updateSeizedGoodService(id, {
      name,
      description,
      value,
      categoryId,
    });

    res.status(200).json(updatedSeizedGood);
  } catch (error) {
    next(error);
  }
};

export const deleteSeizedGood = async (req, res, next) => {
  const { id } = req.params;

  try {
    await deleteSeizedGoodService(id);

    // Notify SSE clients about the deletion
    const message = JSON.stringify({
      type: "delete",
      id: seizedGood.id,
    });
    sseClients.forEach((client) => {
      client.write(`data: ${message}\n\n`);
    });

    res.status(200).json({ message: "Seized good deleted successfully" });
  } catch (error) {
    next(error);
  }
};
