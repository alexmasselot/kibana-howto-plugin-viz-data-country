no clear license was found, except for "free to use" on http://flagpedia.net/download


the flag-def.json flag was simply built has

echo "{" > flag-def.json
for f in $(ls *.png | sed 's/.png//') ; do t=$(file $f.png | cut -f2 -d, | perl -p -e 's/(\d+) x (\d+)/"width":$1, "height":$2/'); echo "  \"$f\": {$t},"; done >> flag-def.json
echo "}" >> flag-def.json