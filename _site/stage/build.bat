set LC_ALL=en_US.UTF-8
set LANG=en_US.UTF-8
call jekyll

cp -r ./_site/* ..
cmd.exe