export default async () => Response.json({ok:false,error:'Direct uploads are not available on this host. Files up to 3 MB upload normally.'},{status:501});
