import { dtoMiddleware } from '../dto.middleware';
import { Request, Response } from 'express';

import { IsString, IsInt, IsOptional } from 'class-validator';

class TestDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsInt()
  @IsOptional()
  age?: number;
}

describe('dtoMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    nextFunction = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('Dovrebbe sanitizzare XSS e procedere se il DTO è valido', async () => {
    mockRequest = {
      body: {
        username: '<script>alert("xss")</script>admin',
        password: 'Password123!',
      },
    };

    const middleware = dtoMiddleware(TestDto);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Il carattere / viene convertito in &#x2F;
    expect(mockRequest.body.username).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;admin');
    expect(mockRequest.body.password).toBe('Password123!');
    expect(nextFunction).toHaveBeenCalled();
  });

  it('Dovrebbe bloccare la richiesta se sono presenti campi extra (Mass Assignment)', async () => {
    mockRequest = {
      body: {
        username: 'user1',
        password: 'password',
        role: 'admin', // Campo non presente nel DTO
      },
    };

    const middleware = dtoMiddleware(TestDto);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'ValidationError' })
    );
  });

  it('Dovrebbe fallire se mancano campi obbligatori', async () => {
    mockRequest = {
      body: {
        username: 'user1',
        // password mancante
      },
    };

    const middleware = dtoMiddleware(TestDto);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'ValidationError' })
    );
  });

  it('Dovrebbe restituire 400 se il body non è un oggetto', async () => {
    mockRequest = { body: "stringa_invalida" };

    const middleware = dtoMiddleware(TestDto);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});