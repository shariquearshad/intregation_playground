import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, property?:any, args?: any): any {
    if(!args) return value;
    return value.filter(
    (item:any) => item[property].toLowerCase().indexOf(args.toLowerCase()) > -1
    );
  }
}

@Pipe({
  name: 'multiColSearch'
})
export class MultiColSearchPipe implements PipeTransform {
  transform(items: any[], properties?:any, searchText?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return properties.some((key:string) => {
        if (item[key] !== null && typeof item[key] === 'object') {
          return Object.keys(item[key]).some(innerKey => {
            const value = item[key][innerKey];
            return value !== null && value.toString().toLowerCase().includes(searchText);
          });
        } else {
          const value = item[key];
          return value !== null && value.toString().toLowerCase().includes(searchText);
        }
      });
    });
  }
}