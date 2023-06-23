import { Router } from "express";
import { wardenAuthLoginSchema } from "../../schema/warden_auth.js";
import prisma from "../../db.js";
import { JWT_SECRET } from "../../../env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Auth Router For Warden
const wardenAuthRouter = Router();

// Path: api/v1/warden/auth/login
// Params: { block, password }
// Returns: { message, data, token? }
// Error: { message, error }
wardenAuthRouter.post("/login", async (req, res) => {
  const { block, password } = req.body;

  try {
    const validWarden = wardenAuthLoginSchema.parse({
      block,
      password,
    });

    const warden = await prisma.warden.findFirst({
      where: {
        block: validWarden.block,
      },
    });

    console.log(warden);

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found please enter valid block",
        data: null,
      });
    }

    const isPasswordValid = bcrypt.compareSync(
      validWarden.password,
      warden.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        id: warden.id,
        block: warden.block,
        name: warden.name,
        role: "warden",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete warden.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                  id: 1,
                  name: "Warden A",
                  block: "A"
                  }
                },
                token: ""
            }
    } */

    return res.status(200).json({
      message: "Warden Logged In",
      data: warden,
      token: token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: "Invalid Warden",
      error: e,
    });
  }
});

export default wardenAuthRouter;
