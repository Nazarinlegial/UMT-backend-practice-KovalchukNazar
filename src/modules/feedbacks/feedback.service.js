import { MESSAGES } from "../../constants/messages.js";
import { HttpError } from "../../utils/HttpError.js";
import * as feedbackRepository from "./feedback.repository.js";

// Testimonials are a small, fully client-rendered slider, so the list endpoint
// returns the complete set (wrapped for a consistent { data } envelope).
export async function list() {
  const items = await feedbackRepository.findAll();
  return { data: items };
}

export async function getById(id) {
  const feedback = await feedbackRepository.findById(id);
  if (!feedback) {
    throw HttpError.notFound(MESSAGES.feedbackNotFound);
  }
  return feedback;
}

export async function create(body) {
  return feedbackRepository.create(body);
}

export async function update(id, body) {
  await getById(id); // 404 if missing
  return feedbackRepository.update(id, body);
}

export async function remove(id) {
  await getById(id); // 404 if missing
  await feedbackRepository.remove(id);
}
