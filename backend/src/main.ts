import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import { join } from "path";

async function bootstrap() {
  const isDev = process.env.NODE_ENV !== "production";
  console.log("Server starting on port", process.env.PORT, "mode=", isDev ? "development" : "production");

  let httpsOptions: { key: Buffer; cert: Buffer } | undefined;
  if (isDev) {
    try {
      const keyPath = join(__dirname, "..", "..", "cert", "localhost.key");
      const certPath = join(__dirname, "..", "..", "cert", "localhost.crt");
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      console.log("Loaded dev HTTPS certificates from /cert");
    } catch (e) {
      console.warn("Dev HTTPS certificates not found, falling back to HTTP. Error:", (e as any).message);
    }
  }

  const app = await NestFactory.create(AppModule, httpsOptions ? { httpsOptions } : {});
  app.setGlobalPrefix("api/v1");
  app.use(bodyParser.raw({ limit: "50mb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  // CORS
  const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://localhost:5173",
    "https://localhost:5174",
    "https://localhost:5175"
  ];
  const extraOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);
  const origins = Array.from(new Set([ ...defaultOrigins, ...extraOrigins ]));
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
  });

  await app.listen(process.env.PORT);
  console.log(`Server listening ${httpsOptions ? "with HTTPS " : ""}on port ${process.env.PORT}`);
}

bootstrap();
