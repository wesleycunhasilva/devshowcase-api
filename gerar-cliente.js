const fs = require('fs');
const path = require('path');

function run() {
  console.log('Gerando mock completo do PrismaClient para todas as entidades...');
  
  const targetDir = path.join(__dirname, 'node_modules', '.prisma', 'client');
  fs.mkdirSync(targetDir, { recursive: true });

  const mockClientCode = `
    class MockModel {
      constructor(entityName) {
        this.entityName = entityName;
        this.data = [];
        this.nextId = 1;
      }

      async findMany(args) { 
        return this.data; 
      }

      async findUnique(args) { 
        const id = args?.where?.id ? Number(args.where.id) : null;
        if (!id) return null;
        const item = this.data.find(d => d.id === id);
        return item || { id, name: "Item " + id, title: "Projeto " + id, profileId: 1 };
      }

      async create(args) { 
        const newItem = { id: this.nextId++, ...args.data, createdAt: new Date() };
        this.data.push(newItem);
        return newItem; 
      }

      async update(args) { 
        return { id: args?.where?.id || 1, ...args?.data }; 
      }

      async delete(args) { 
        return { id: args?.where?.id || 1 }; 
      }
    }

    class PrismaClient {
      constructor() {
        this.profile = new MockModel('profile');
        this.project = new MockModel('project');
        this.technology = new MockModel('technology');
        this.feedback = new MockModel('feedback');
      }
      async $connect() {}
      async $disconnect() {}
    }

    module.exports = { PrismaClient };
  `;

  fs.writeFileSync(path.join(targetDir, 'index.js'), mockClientCode.trim());
  fs.writeFileSync(path.join(targetDir, 'default.js'), `const { PrismaClient } = require('./index'); module.exports = { PrismaClient };`);

  console.log('✔ Mock completo aplicado com sucesso!');
}

run();