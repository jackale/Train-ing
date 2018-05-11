#!/bin/bash

RUBY_VERSION="2.3.4"

sudo apt-get update
sudo apt-get -y install git curl g++ make
sudo apt-get -y install zlib1g-dev libssl-dev libreadline-dev
sudo apt-get -y install libyaml-dev libxml2-dev libxslt-dev
sudo apt-get -y install sqlite3 libsqlite3-dev nodejs

git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
echo 'export RBENV_ROOT="$HOME/.rbenv"' >> ~/.bash_profile
echo 'export PATH="${RBENV_ROOT}/bin:${PATH}"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile

git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

source ~/.bash_profile

rbenv install -v $RUBY_VERSION
rbenv rehash
rbenv global -v $RUBY_VERSION

gem update --system
gem install --no-ri --no-rdoc rails
gem install bundler
rbenv rehash

rails new testApp
