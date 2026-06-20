all: update-repo

update-repo:
	git add -A
	git commit -m "Update"
	git push origin main