import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageJson from 'packageJson';

export function useSwagger(app: INestApplication) {
	const logger = new Logger('Swagger');
	const port = process.env.PORT || 3000;
	const path = 'docs';
	const title = 'Bookstore Documentation';
	const version = packageJson.version;
	const description = packageJson.description;

	const config = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		.setVersion(version)
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config, );
	SwaggerModule.setup(path, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			tagsSorter: 'alpha',
			operationsSorter: (a, b) => {
				const methodsOrder = ['get', 'post', 'put', 'patch', 'delete', 'options', 'trace'];
				let result =
					methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));

				if (result === 0) {
					result = a.get('path').localeCompare(b.get('path'));
				}

				return result;
			}
		}
	});
	logger.log(`Your documentation is running on http://localhost:${port}/${path}`);
}