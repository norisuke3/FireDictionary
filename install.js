initInstall("Install FireDictionary", "firedictionary", "0.1");

var targetFolder = getFolder("Chrome");

setPackageFolder(targetFolder);
addFile("chrome/firedictionary.jar");

targetFolder = getFolder(targetFolder, "firedictionary.jar");

registerChrome(CONTENT | DELAYED_CHROME,
  targetFolder, "content/firedictionary/");
  
if (0 == getLastError()){
				performInstall();
}else{
	   cancelInstall();
}