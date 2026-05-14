const dns = require('dns');

const configureDns = () => {
  const servers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map(server => server.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
  }
};

module.exports = configureDns;
