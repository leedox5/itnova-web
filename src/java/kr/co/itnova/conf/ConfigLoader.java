package kr.co.itnova.conf;

import java.io.IOException;

import kr.co.itnova.util.CustomClassLoader;
import emro.util.StringUtil;
import eswf.description.ElementXMLDescriptor;
import eswf.exception.FoundationException;
import eswf.managers.XMLManager;

public class ConfigLoader {
	private String repoPath;

	public String getRepoPath() {
		return repoPath;
	}

	public void setRepoPath(String repoPath) {
		this.repoPath = repoPath;
	}

	public ConfigLoader(String repo) throws FoundationException {
		try {
			ElementXMLDescriptor exmld = XMLManager.getInstance().getDescriptor("conf");
			this.repoPath = exmld.getDescriptorElement(repo).getTextTrim();
		} catch(Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
	
	public Object getObj() throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
		ClassLoader parentClassLoader = ConfigLoader.class.getClassLoader();
		CustomClassLoader classLoader = new CustomClassLoader(parentClassLoader);
		
		Class<?> clazz = classLoader.loadClass(repoPath, getName());
		
		Config obj = (Config) clazz.newInstance();
		
		return obj;
	}

	private String getName() {
		int start = repoPath.indexOf("kr/co/itnova");
		int end = repoPath.indexOf(".class");
		String s = repoPath.substring(start, end);
		String[] a1 = {"/"};
		String[] a2 = {"."};
		String ret = StringUtil.replace(s, a1, a2);
		
		return ret;
	}
}
