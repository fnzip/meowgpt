interface Model {
  id: string;
  object: "model";
  owned_by: string;
}

interface ModelsResponse {
  object: "list";
  data: Model[];
}

export function buildModelsResponse(): ModelsResponse {
  return {
    object: "list",
    data: [
      {
        id: "meowgpt",
        object: "model",
        owned_by: "meowgpt",
      },
    ],
  };
}
