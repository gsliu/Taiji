DIR="../VisualEsxtopOnline/server/static/output"
cd $DIR
for k in $(ls)
do
  echo $k
  sed -i 's/.$/]/' $k
done
