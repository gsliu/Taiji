DIR="../VisualEsxtopOnline/server/static/output"
cd $DIR
for k in $(ls )
do
  sed -i 's/.$/]/' $k
done
