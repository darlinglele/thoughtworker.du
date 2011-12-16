window["DOUBAN"]["BOOKS"]["FETCHER"] = function(ids, douban_books_callback) {
	this.ids = ids;
	this.fetch_books = function() {
		for (var i = 0; i < ids.length;i++) {
			var books_for_individual = new DOUBAN.BOOKS.DOMAIN.BOOKS()
			this.fetch_books_for(ids[i], 1, books_for_individual);
		}
	};
	this._parse = function(id, book) {
		var aBook = DOUBAN.parseSubject(book['db:subject']);
		var image = aBook.link.image;
		var image_url = image.replace("spic", "lpic");
		var douban_url = aBook.link.alternate;
		return new DOUBAN.BOOKS.DOMAIN.BOOK(id, image_url, douban_url)
	}
	this.fetch_books_for = function(id, start_index, books_for_individual) {
		DOUBAN.apikey = '060ca04f1db455951225e0ed591d00bf';
		var doubanbooks = this;
		DOUBAN.getUserCollection({
			uid:id,
			cat:'book',
			status:'read',
			maxresults:'50',
			startindex:start_index,
			callback:function(books){
				if (books.entry.length == 0) {
					douban_books_callback.act_with(books_for_individual);
					return;
				}
				for(var idx = 0; idx < books.entry.length; idx++) {
					books_for_individual.add(doubanbooks._parse(id, books.entry[idx]))
				}
				doubanbooks.fetch_books_for(id, start_index + 50, books_for_individual)
			}
		});		
	}
}