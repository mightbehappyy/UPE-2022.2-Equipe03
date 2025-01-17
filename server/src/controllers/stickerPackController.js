import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createCompraPac(req, res) {
        try {
          const { email } = req.body;
      
          const value = await prisma.pacotefig.findUnique({
            where: { pacId: 1 },
            select: {price: true},
          });
          let userId = await prisma.usuario.findUnique({
            where: { email },
            select: { userId: true },
          });
          let usuario = await prisma.usuario.findUnique({ where: { email } });
      
          if (value.price > usuario.money) {
            return res.json(false);
          }
      
          const createPacProd = async ( invId) => {
            const pp = await prisma.pac_product.create({
              data: { invId },
            });
      
            return pp;
          };
      
          const invt = await prisma.inventario.findUnique({
            where: { userId: userId.userId },
          });
      
          const ngp = await createPacProd(invt.invId);
          const newMoney = usuario.money - value.price;
      
          usuario = await prisma.usuario.update({
            where: { email },
            data: { money: newMoney },
          });
      
          res.json(true);
        } catch (error) {
          console.error(error); 
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
      },
      async findAllpackages(req, res) {
        try {
          const packages = await prisma.pacotefig.findMany();
          return res.json(packages);
        } catch (error) {
          return res.json({ error });
        }
      },  
      async findInv(req, res) {
        try {
          const { invId } = req.params;
    
          const inventario = await prisma.inventario.findUnique({
            where: { invId: Number(invId) },
            include: {
              pac_product: {
                select:{
                  pacprodId: true,
                  pacotefig: {
                    select: {
                      pacId: true,
                      name: true,
                      image: true,
                      price: true
                      }
                    }
                  
                }
              }
            }
          });
    
          if (!inventario) {
            return res.json({ error: "inventario não encontrado" });
          }
          const pacotinho = inventario.pac_product.map((pp) => {
            return {
              pacprodId: pp.pacprodId,
              ...pp.pacotefig
            };
          });
          return res.json(pacotinho);
        } catch (error) {
          return res.json({ error });
        }
      },
      async openPack(req, res) {
        try {
          const { pacprodId, invId } = req.body;
      
          const pacProd = await prisma.pac_product.findUnique({
            where: { pacprodId },
          });
      
          const gatIds = [pacProd.gatId1, pacProd.gatId2, pacProd.gatId3, pacProd.gatId4, pacProd.gatId5];
      
          const gatProds = await prisma.$transaction(gatIds.map((gatId) => {
            return prisma.gaturinha_product.create({
              data: { gatId, invId },
            });
          }));
          await prisma.pac_product.delete({
            where:{ pacprodId: pacprodId}})
          return res.json(true);
        } catch (error) {
          return res.json({ error });
        }
      }
      
    };