export function parseKeystoreInfo(input: string): object {
  const lines = input.split("\n").map((line) => line.trim());
  const keystoreInfo: any = {
    keystoreType: "",
    provider: "",
    entries: [],
  };

  let currentEntry: any = null;

  lines.forEach((line) => {
    if (line.startsWith("密钥库类型:")) {
      keystoreInfo.keystoreType = line.split(": ")[1];
    } else if (line.startsWith("密钥库提供方:")) {
      keystoreInfo.provider = line.split(": ")[1];
    } else if (line.startsWith("别名:")) {
      currentEntry = {
        alias: line.split(": ")[1],
        certificate: {},
      };
      keystoreInfo.entries.push(currentEntry);
    } else if (currentEntry) {
      if (line.startsWith("创建日期:")) {
        currentEntry.creationDate = line.split(": ")[1];
      } else if (line.startsWith("条目类型:")) {
        currentEntry.entryType = line.split(": ")[1];
      } else if (line.startsWith("证书链长度:")) {
        currentEntry.certificateChainLength = parseInt(line.split(": ")[1], 10);
      } else if (line.startsWith("所有者:")) {
        currentEntry.certificate.owner = line.split(": ")[1];
      } else if (line.startsWith("发布者:")) {
        currentEntry.certificate.issuer = line.split(": ")[1];
      } else if (line.startsWith("序列号:")) {
        currentEntry.certificate.serialNumber = line.split(": ")[1];
      } else if (line.startsWith("生效时间:")) {
        currentEntry.certificate.validFrom = line.split(": ")[1];
      } else if (line.startsWith("失效时间:")) {
        currentEntry.certificate.validTo = line.split(": ")[1];
      } else if (line.startsWith("SHA1:")) {
        currentEntry.certificate.fingerprints = currentEntry.certificate.fingerprints || {};
        currentEntry.certificate.fingerprints.SHA1 = line.split(": ")[1];
      } else if (line.startsWith("SHA256:")) {
        currentEntry.certificate.fingerprints = currentEntry.certificate.fingerprints || {};
        currentEntry.certificate.fingerprints.SHA256 = line.split(": ")[1];
      } else if (line.startsWith("MD5:")) {
        currentEntry.certificate.fingerprints = currentEntry.certificate.fingerprints || {};
        currentEntry.certificate.fingerprints.MD5 = line.split(": ")[1];
      } else if (line.startsWith("签名算法名称:")) {
        currentEntry.certificate.signatureAlgorithm = line.split(": ")[1];
      } else if (line.startsWith("主体公共密钥算法:")) {
        currentEntry.certificate.publicKeyAlgorithm = line.split(": ")[1];
      } else if (line.startsWith("版本:")) {
        currentEntry.certificate.version = parseInt(line.split(": ")[1], 10);
      } else if (line.startsWith("#1: ObjectId:")) {
        currentEntry.certificate.extensions = currentEntry.certificate.extensions || [];
        currentEntry.certificate.extensions.push({
          objectId: line.split(": ")[1].split(" ")[0],
          criticality: line.split("Criticality=")[1] === "false",
          subjectKeyIdentifier: "",
        });
      } else if (line.startsWith("KeyIdentifier [")) {
        currentEntry.certificate.extensions[currentEntry.certificate.extensions.length - 1].subjectKeyIdentifier = lines
          .slice(lines.indexOf(line) + 1, lines.indexOf(line) + 3)
          .join(" ")
          .replace(/[\s:]/g, "");
      }
    }
  });

  // 提取顶层信息
  const topLevelInfo = keystoreInfo.entries.map((entry: any) => ({
    alias: entry.alias,
    SHA1: entry.certificate.fingerprints?.SHA1,
    SHA256: entry.certificate.fingerprints?.SHA256,
    MD5: entry.certificate.fingerprints?.MD5,
  }));

  return {
    keystoreType: keystoreInfo.keystoreType,
    provider: keystoreInfo.provider,
    entries: keystoreInfo.entries,
    topLevelInfo,
  };
}
