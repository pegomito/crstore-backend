import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs';

/**
 * Função para fazer o upload de arquivos
 * @param file deve ser um arquivo vindo de req.files
 * @param params deve serum objeto contendo tipo tabela e id  
 * id: chave primaria do registro que tera ligacao com a imagem
 * tabela: nome da tabela que tera ligacao com o id cadastrado
 * tipo: tipo de arquivo que sera enviado, exemplo: imagem, video, audio
 * @return Objeto contendo erro ou sucesso
 **/
export default async (file, params) => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    let extensao = path.extname(file.name);
    let filePath = `public/${params.tipo}/${params.tabela}`;
    let fileName = `${params.id}${extensao}`;
    let fullDir = path.join(__dirname, '../../', filePath);

    // Garante que a pasta existe
    fs.mkdirSync(fullDir, { recursive: true });

    let uploadPath = path.join(fullDir, fileName);
    await file.mv(uploadPath);

    return {
      type: 'success',
      message: 'arquivo enviado com sucesso',
      uploadPath: path.join(filePath, fileName)
    };
  } catch (error) {
    return {
      type: 'erro',
      message: error.message
    };
  }
}


