#
# file generator for iknow/iKnowMyListManager.html
#

array = []

File.open("src/content/firedictionary/iknow/iKnowMyListManager-template.html", "r") {|file|
  file.each { |line| 
    if /<script-src src="(.*)"\/>/ =~ line then
      file = "src/content/firedictionary/" + $1
      File.open(file, "r"){|file2|
        file2.each() {|line2| 
          array.push line2.chomp("\r\n")
        }
      }
    else
      array.push line 
    end
  }
}

File.open("src/content/firedictionary/iknow/iKnowMyListManager.html", "w"){|f|
  array.each {|line| f.puts(line)}
}

#
# file generator for view/WordHistoryAndExcerpt.html
#

array = []

File.open("src/content/firedictionary/view/WordHistoryAndExcerpt-template.html", "r") {|file|
  file.each { |line| 
    if /<script-src src="(.*)"\/>/ =~ line then
      file = "src/content/firedictionary/" + $1
      File.open(file, "r"){|file2|
        file2.each() {|line2| 
          array.push line2.chomp("\r\n")
        }
      }
    else
      array.push line 
    end
  }
}

File.open("src/content/firedictionary/view/WordHistoryAndExcerpt.html", "w"){|f|
  array.each {|line| f.puts(line)}
}

