import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    //traer todo
    order: [
      ["id", "ASC"], //  price => ASC | DESC
    ],
    // attributes: { exclude: ["createdAt"] }, // excluye al hacer GET
    // limit: 2, // Limita al hacer GET
  });
  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  // console.log(req.params.id); //*"id => /:id"
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({
      error: "Producto No Encontrado",
    });
    return; // ------- SUGERIDO POR CHATGPT
  }

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  // Crear producto
  const product = await Product.create(req.body);
  // Responder con el producto creado
  res.status(201).json({ data: product });
  // res.json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      error: "Producto No Encontrado",
    });
    return; // ------- SUGERIDO POR CHATGPT
  }

  // Actualizar
  await product.update(req.body);
  await product.save();
  res.json({ data: product }); // Solo se llama una vez
};

export const updateAvailability = async (req: Request, res: Response) => {
  // --- TRAEMOS el GET para saber si EXISTE producto editaremos (ARRIBA)
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({
      error: "Producto No Encontrado",
    });
    return;
  }

  //ACTUALIZAR
  // console.log(req.body)

  //* PATCH=> ya tiene "upadte" automatico __SE TREA TODOLOS DEMAS
  product.availability = !product.dataValues.availability;
  await product.save(); //almacena bd

  // console.log(product.dataValues.availability) //* MODIFICAR 1 parte

  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  // --- TRAEMOS el GET para saber si EXISTE producto editaremos (ARRIBA)
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({
      error: "Producto No Encontrado",
    });
    return;
  }

  await product.destroy();
  res.json({ data: "Producto Eliminado" });
};
