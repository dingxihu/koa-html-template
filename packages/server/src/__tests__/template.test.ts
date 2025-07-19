import koaHtmlTemplate from '../template';
import { Context, Next } from 'koa';

describe('Koa HTML Template Engine', () => {
  let mockCtx: Partial<Context>;
  let mockNext: Next;

  beforeEach(() => {
    mockCtx = {
      body: undefined,
    };
    mockNext = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add template method to context', async () => {
    const middleware = koaHtmlTemplate('./test-templates');
    
    await middleware(mockCtx as Context, mockNext);
    
    expect(mockCtx.template).toBeDefined();
    expect(typeof mockCtx.template).toBe('function');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should render simple variable substitution', async () => {
    // Mock fs.readFileSync to return a test template
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue('<h1>Hello {{name}}!</h1>');

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    // Call template method
    (mockCtx as any).template('test.html', { name: 'World' });

    expect(mockCtx.body).toBe('<h1>Hello World!</h1>');
  });

  it('should handle conditional rendering', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      '<div>{if showMessage}<p>Message is visible</p>{/if}</div>'
    );

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    // Test with condition true
    (mockCtx as any).template('test.html', { showMessage: true });
    expect(mockCtx.body).toBe('<div><p>Message is visible</p></div>');

    // Test with condition false
    (mockCtx as any).template('test.html', { showMessage: false });
    expect(mockCtx.body).toBe('<div></div>');
  });

  it('should handle array loops', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      '<ul>{for items}<li>{$index}: {$value}</li>{/for}</ul>'
    );

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    (mockCtx as any).template('test.html', { items: ['apple', 'banana', 'cherry'] });
    
    expect(mockCtx.body).toBe('<ul><li>0: apple</li><li>1: banana</li><li>2: cherry</li></ul>');
  });

  it('should handle object loops', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      '<div>{for user}<p>{$key}: {$value}</p>{/for}</div>'
    );

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    (mockCtx as any).template('test.html', { 
      user: { name: 'John', age: 30, city: 'New York' } 
    });
    
    expect(mockCtx.body).toContain('<p>name: John</p>');
    expect(mockCtx.body).toContain('<p>age: 30</p>');
    expect(mockCtx.body).toContain('<p>city: New York</p>');
  });

  it('should handle nested object properties in loops', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      '<div>{for users}<p>{$value.name} - {$value.email}</p>{/for}</div>'
    );

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    (mockCtx as any).template('test.html', { 
      users: [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' }
      ]
    });
    
    expect(mockCtx.body).toBe('<div><p>John - john@example.com</p><p>Jane - jane@example.com</p></div>');
  });

  it('should handle undefined variables gracefully', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue('<p>{{undefinedVar}}</p>');

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    (mockCtx as any).template('test.html', {});
    
    expect(mockCtx.body).toBe('<p></p>');
  });

  it('should handle complex template with multiple features', async () => {
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`
      <div>
        <h1>{{title}}</h1>
        {if showUsers}
          <ul>
            {for users}
              <li>User {$index}: {$value.name} ({$value.role})</li>
            {/for}
          </ul>
        {/if}
        {if showFooter}
          <footer>{{footerText}}</footer>
        {/if}
      </div>
    `);

    const middleware = koaHtmlTemplate('./test-templates');
    await middleware(mockCtx as Context, mockNext);

    (mockCtx as any).template('test.html', {
      title: 'User List',
      showUsers: true,
      showFooter: true,
      footerText: 'Copyright 2023',
      users: [
        { name: 'Admin', role: 'administrator' },
        { name: 'User', role: 'user' }
      ]
    });
    
    const result = mockCtx.body as string;
    expect(result).toContain('<h1>User List</h1>');
    expect(result).toContain('<li>User 0: Admin (administrator)</li>');
    expect(result).toContain('<li>User 1: User (user)</li>');
    expect(result).toContain('<footer>Copyright 2023</footer>');
  });

  it('should use default template path when none provided', async () => {
    const middleware = koaHtmlTemplate();
    
    await middleware(mockCtx as Context, mockNext);
    
    expect(mockCtx.template).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });
}); 