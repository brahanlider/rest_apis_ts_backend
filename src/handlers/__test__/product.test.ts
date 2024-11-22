import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  // testing validation
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({
      //
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4); //EN EL POST -thunder-

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2); //EN EL POST -thunder-
  });

  // validar precio mayor que 0
  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo -testing precio",
      price: 0,
      //
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1); //EN EL POST -thunder-

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2); //EN EL POST -thunder-
  });

  // validar precio EVITAR string
  it("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo -testing precio",
      price: "hola",
      //
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2); //EN EL POST -thunder-

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4); //EN EL POST -thunder-
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      //crear producto -testing (NO OLVIDES HTTPS:status(201)))
      name: "Celular Nokia - Testing ULTIMO chatgpt - POST",
      price: 400,
    });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  //tamb se puede => 1ro EXISTA
  it("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });

  it("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1); // productos

    // expect(response.status).not.toBe(404);
    expect(response.status).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  // id no existe
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000; //id => no exita
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto No Encontrado");
  });

  // id en caso de que sea string
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server).get("/api/products/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  // Obtenga una respuesta JSON para un solo producto
  it("get a JSON response for a single product", async () => {
    const response = await request(server).get("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  // id en caso de que sea string => PARAM
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url")
      .send({
        name: "Monitor Curvo ---PUT",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  //Debería mostrar mensajes de error de validación al actualizar un producto
  it("Should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy(); // value en contexto de boolean
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // Debe validar que el precio sea mayor a 0
  it("Should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor Curvo ---PUT",
      availability: true,
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy(); // value en contexto de boolean
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Precio no valido");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // Debería devolver una respuesta 404 para un producto inexistente => updateProduct de PUT
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo",
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto No Encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // Debe actualizar un producto existente con datos válidos
  it("Should update an existing product with valid data", async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: "Monitor Curvo",
      availability: true,
      price: 300,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  // Debería devolver una respuesta 404 para un producto inexistente
  it("should return a 404 response for a non-existing product", async () => {
    const productId = 2000;
    const response = await request(server).patch(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto No Encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // Debería actualizar la disponibilidad del producto
  it("should update the product availability", async () => {
    const response = await request(server).patch("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/:id", () => {
  // Debe comprobar una identificación válida
  it("Should check a valid ID", async () => {
    const response = await request(server).delete("/api/products/not-valid");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no válido");
  });

  // Debería devolver una respuesta 404 para un producto inexistente
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto No Encontrado");

    expect(response.status).not.toBe(200);
  });

  // Debería eliminar un producto
  it("Should delete a product", async () => {
    const response = await request(server).delete(`/api/products/1`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("Producto Eliminado");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});
