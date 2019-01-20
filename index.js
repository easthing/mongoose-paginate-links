const querystring = require('querystring');
const paginate = require('mongoose-paginate-v2');


module.exports = function paginateLinks(schema) {
  schema.statics.paginate = async function() {
    const result = await paginate.paginate.apply(this, arguments);

    result.links = function(defaultQuery = null, size='pagination-md', prev='Previous', next='Next') {
      let baseUrl = '';
      if (defaultQuery) {
        baseUrl = querystring.stringify(defaultQuery) + '&';
      }

      if (this.totalPages > 1) {
        let start = 1;
        let perPage = 6;
        const half = perPage / 2;
        const lis = [];
        const page = parseInt(this.page) || 1;

        if (page > perPage) {
          start = page - half
        }
        if (page + perPage > this.totalPages) {
          start = this.totalPages - perPage;
        }
        if (start < 0) {
          start = 1;
        }

        let pages = perPage;
        if (this.totalPages < perPage || page + half >= this.totalPages) {
          pages = this.totalPages;
        } else {
          pages = start + perPage;
        }

        if (page < perPage - half && this.totalPages > perPage) {
          perPage += half;
        }

        for (let i = start; i <= pages; i++) {
          if (i === page) {
            lis.push(`<li class="page-item active"><a class="page-link" href="?${baseUrl}p=${i}">${i}</a></li>`)
          } else {
            lis.push(`<li class="page-item"><a class="page-link" href="?${baseUrl}p=${i}">${i}</a></li>`)
          }
        }

        if (page > perPage) {
          lis.unshift(`<li class="page-item disabled"><a class="page-link">⋯</a></li>`);
          lis.unshift(`<li class="page-item"><a class="page-link" href="?${baseUrl}p=1">1</a></li>`);
        }

        if (this.totalPages - page > perPage) {
          lis.push(`<li class="page-item disabled"><a class="page-link">⋯</a></li>`);
          lis.push(`<li class="page-item"><a class="page-link" href="?${baseUrl}p=${this.totalPages}">${this.totalPages}</a></li>`);
        }

        // prev & next
        if (page === 1) {
          lis.unshift(`<li class="page-item disabled"><a class="page-link">${prev}</a></li>`)
        } else {
          lis.unshift(`<li class="page-item"><a class="page-link" href="?${baseUrl}p=${page - 1}">${prev}</a></li>`)
        }

        if (page === this.totalPages) {
          lis.push(`<li class="page-item disabled" class="disabled"><a class="page-link">${next}</a></li>`)
        } else {
          lis.push(`<li class="page-item"><a class="page-link" href="?${baseUrl}p=${page + 1}">${next}</a></li>`)
        }

        return `
          <ul class="pagination ${size}">
            ${lis.join('')}
          </ul>
        `
      }
    }

    return result;
  }
}
