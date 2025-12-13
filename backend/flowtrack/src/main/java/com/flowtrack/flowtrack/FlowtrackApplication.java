package com.flowtrack.flowtrack;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.nio.file.Paths;

@SpringBootApplication
public class FlowtrackApplication {

	public static void main(String[] args) {
		// Carrega o .env da raiz do projeto (2 níveis acima do diretório do backend)
		// Estrutura: flowtrack/backend/flowtrack/src/main/java/...
		// Precisamos ir para: flowtrack/.env
		try {
			File currentDir = new File(System.getProperty("user.dir"));
			File projectRoot = currentDir;
			
			// Se estiver rodando de dentro do diretório backend/flowtrack, sobe 2 níveis
			if (currentDir.getName().equals("flowtrack") && 
			    currentDir.getParentFile() != null && 
			    currentDir.getParentFile().getName().equals("backend")) {
				projectRoot = currentDir.getParentFile().getParentFile();
			}
			// Se estiver rodando da raiz do projeto
			else if (currentDir.getName().equals("flowtrack") || 
			         (currentDir.getParentFile() != null && currentDir.getParentFile().getName().equals("flowtrack"))) {
				// Já está na raiz ou próximo
				if (currentDir.getParentFile() != null && currentDir.getParentFile().getName().equals("flowtrack")) {
					projectRoot = currentDir.getParentFile();
				}
			}
			
			File envFile = new File(projectRoot, ".env");
			
			if (envFile.exists()) {
				Dotenv dotenv = Dotenv.configure()
					.directory(projectRoot.getAbsolutePath())
					.filename(".env")
					.ignoreIfMissing()
					.load();
				
				// Carrega as variáveis do .env para o System.getenv()
				dotenv.entries().forEach(entry -> {
					String key = entry.getKey();
					String value = entry.getValue();
					if (System.getenv(key) == null) {
						System.setProperty(key, value);
					}
				});
				
				System.out.println("? Arquivo .env carregado de: " + envFile.getAbsolutePath());
			} else {
				System.out.println("? Arquivo .env não encontrado em: " + envFile.getAbsolutePath());
				System.out.println("  Usando variáveis de ambiente do sistema ou valores padrão.");
			}
		} catch (Exception e) {
			System.err.println("? Erro ao carregar .env: " + e.getMessage());
			System.out.println("  Continuando com variáveis de ambiente do sistema ou valores padrão.");
		}
		
		SpringApplication.run(FlowtrackApplication.class, args);
	}

}
