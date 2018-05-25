FROM php:7.1-fpm

MAINTAINER takashima_ryo <takashima@cloverlab.jp>

# mysql
RUN docker-php-ext-install mysqli

# redis
RUN docker-php-source extract \
    && curl -L -o /tmp/redis.tar.gz https://github.com/phpredis/phpredis/archive/3.0.0.tar.gz \
    && tar xfz /tmp/redis.tar.gz \
    && rm -r /tmp/redis.tar.gz \
    && mv phpredis-3.0.0 /usr/src/php/ext/redis \
    && docker-php-ext-install redis

# memcached
RUN apt-get update && apt-get install -y libmemcached-dev zlib1g-dev
RUN curl -L -o /tmp/memcached.tar.gz https://github.com/php-memcached-dev/php-memcached/archive/php7.tar.gz \
  && tar xfz /tmp/memcached.tar.gz \
  && rm -r /tmp/memcached.tar.gz \
  && mv php-memcached-php7 /usr/src/php/ext/memcached \
  && docker-php-ext-install memcached

# Composer

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

RUN apt-get install -y git

COPY composer.json /var/www/html/

RUN composer install

RUN mkdir -p /var/www/html/application/views/templates
RUN mkdir -p /var/www/html/application/views/templates_c
RUN chmod 777 /var/www/html/application/views/templates
RUN chmod 777 /var/www/html/application/views/templates_c