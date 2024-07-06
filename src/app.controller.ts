import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('home')
@Controller()
export class AppController {
    @Get()
    @ApiOperation({ summary: 'Get API Home Page' })
    @ApiResponse({ status: 200, description: 'Returns the home page with API details.' })
    getHome(): string {
        return `
      <html>
        <head>
          <title>Movie Management API</title>
        </head>
        <body>
          <h1>Welcome to the Movie Management API</h1>
          <p>This API allows you to manage movies, users, and tickets.</p>
          <ul>
            <li><strong>Users:</strong> Register, login, and manage user data.</li>
            <li><strong>Movies:</strong> Add, update, and delete movies.</li>
            <li><strong>Tickets:</strong> Buy tickets and view watch history.</li>
          </ul>
          <p>For detailed API documentation, visit <a href="/docs">Swagger API Docs</a>.</p>
        </body>
      </html>
    `;
    }
}
