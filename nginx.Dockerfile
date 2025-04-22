FROM duluca/minimal-nginx-web-server:1-alpine

COPY dist/pareto-factory /var/www

CMD 'nginx'
