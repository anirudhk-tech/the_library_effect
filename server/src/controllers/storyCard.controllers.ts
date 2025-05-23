import { Request, Response, NextFunction } from "express";
import * as services from "../services/storyCard.services";
import { StoryCard } from "../models/storyCard.model";

export const checkBoardExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    "[RECIEVED] checkBoardExists: Checking if board " + req.params.boardId
  );

  try {
    const boardId = req.params.boardId;
    const boardExists = await services.checkBoardExists(boardId);
    if (!boardExists) {
      res.status(404).json({ message: "Board not found" });
      return;
    }
    res.status(200).json({ message: "Board exists" });
  } catch (error) {
    next(error);
  }
};

export const listCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(
      "[RECIEVED] listCards: Fetching cards for board " + req.params.boardId
    );

    const boardId = req.params.boardId;
    const cards: StoryCard[] = await services.getAllCards(boardId);

    const formattedCards: {
      content: string;
      pos: { x: number; y: number };
      height: number;
      id: string;
      createdAt: string;
      boardId: string;
    }[] = cards.map((card) => ({
      content: card.content,
      pos: { x: card.pos_x, y: card.pos_y },
      height: card.height,
      id: card.id,
      createdAt: card.created_at,
      boardId: card.board_id,
    }));

    res.json(formattedCards);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[RECIEVED] getCard: Fetching card " + req.params.id);

  try {
    const id = req.params.id;
    const card = await services.getCardById(id);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }
    res.json(card);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(
      "[RECIEVED] createCard: Creating card for board " + req.params.boardId
    );

    const boardId = req.params.boardId;
    const { content, pos, height } = req.body;

    const data = await services.createCard({
      content,
      pos,
      height,
      boardId,
    } as {
      content: string;
      pos: { x: number; y: number };
      height: number;
      boardId: string;
    });

    const newCard = {
      content: data.content,
      pos: { x: data.pos_x, y: data.pos_y },
      height: data.height,
      id: data.id,
      createdAt: data.created_at,
    };

    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[RECIEVED] updateCard: Updating card " + req.params.id);

    const id = req.params.id;
    const boardId = req.params.boardId;
    const { content, pos, height } = req.body;
    const updatedCard = await services.updateCard(id, boardId, {
      content,
      pos,
      height,
    });
    if (!updatedCard) {
      res.status(404).json({ message: "Card not found" });
      return;
    }
    res.json(updatedCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[RECIEVED] deleteCard: Deleting card " + req.params.id);

    const id = req.params.id;
    const deletedCard = await services.removeCard(id);
    if (!deletedCard) {
      res.status(404).json({ message: "Card not found" });
      return;
    }
    res.json(deletedCard);
  } catch (error) {
    next(error);
  }
};
